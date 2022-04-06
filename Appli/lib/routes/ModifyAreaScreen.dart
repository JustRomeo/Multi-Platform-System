import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import 'package:area/components/TopBar.dart';
import 'package:area/Area.dart';
import 'package:area/components/AreaInfo.dart';
import 'package:area/providers/UserInfo.dart';

class ScreenArgs {
  final Area area;

  ScreenArgs(this.area);
}

class ModifyAreaScreen extends StatefulWidget {
  @override
  _ModifyAreaScreenState createState() => _ModifyAreaScreenState();
}

class _ModifyAreaScreenState extends State<ModifyAreaScreen> {
  void handleSubmit(Area area) {
    final UserInfo user = Provider.of<UserInfo>(context, listen: false);
    area.addActionArgValue(area.actionName);
    area.addReactionArgValue(area.reactionName);
    final Map<String, dynamic> body = {
      'actionService': area.actionService,
      'actionParameter': area.actionParamsValues,
      'reactionService': area.reactionService,
      'reactionParameter': area.reactionParamsValues,
      'id': area.id
    };
    http
        .post(
          "https://back-area.herokuapp.com/area/modifyArea",
          headers: {
            "Authorization": user.bearerToken,
            'Content-type': 'application/json'
          },
          body: jsonEncode(body),
        )
        .then(
          (value) => {
            if (value.statusCode == 200)
              {print(value.body), Navigator.pop(context)}
          },
        );
  }

  @override
  Widget build(BuildContext context) {
    final Area area = ModalRoute.of(context).settings.arguments;

    final handleActionChange = (String service, String title, String name,
        List<String> params, List<String> paramsValues) {
      setState(() {
        area.addAction(service, title, name, params, paramsValues);
      });
    };

    final handleReactionChange = (String service, String title, String name,
        List<String> params, List<String> paramsValues) {
      setState(() {
        area.addReaction(service, title, name, params, paramsValues);
      });
    };

    final handleRemove = () async {
      final UserInfo user = Provider.of<UserInfo>(context, listen: false);
      final res = await http.post('https://back-area.herokuapp.com/area/removeArea',
          headers: {
            'Authorization': user.bearerToken,
            'Content-Type': 'application/json'
          },
          body: jsonEncode({'id': area.id}));
      if (res.statusCode == 200) {
        Navigator.pop(context);
      }
    };

    return Container(
      child: Column(
        children: [
          TopBar('Modifier mon Area', 36),
          AreaInfo(
            isAction: true,
            text: "Quand, ",
            title: area.actionTitle,
            color: Colors.grey,
            callback: handleActionChange,
          ),
          AreaInfo(
            isAction: false,
            text: "Alors, ",
            title: area.reactionTitle,
            color: Colors.black,
            callback: handleReactionChange,
          ),
          IconButton(
            icon: Icon(
              Icons.add,
              color: Colors.green,
            ),
            onPressed: () => handleSubmit(area),
          ),
          IconButton(
            icon: Icon(
              Icons.block,
              color: Colors.red,
            ),
            onPressed: handleRemove,
          )
        ],
      ),
    );
  }
}
