import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import 'package:area/components/TopBar.dart';
import 'package:area/providers/UserInfo.dart';

class NewValue {
  String serviceTitle;
  String title;
  String name;
  List<String> arguments;
  List<String> values;

  NewValue(
      this.serviceTitle, this.title, this.name, this.arguments, this.values) {
    if (values == null) {
      values = [];
    }
    values.insert(0, name);
  }
}

class CreateAreaCard extends StatefulWidget {
  @override
  _CreateAreaCardState createState() => _CreateAreaCardState();
}

class _CreateAreaCardState extends State<CreateAreaCard> {
  NewValue _action;
  NewValue _reaction;

  void handleActionPageResponse() async {
    final result = await Navigator.pushNamed(context, "/choose-action") as Map;

    if (result == null) {
      return;
    }
    setState(() {
      this._action = NewValue(result['serviceTitle'], result['title'],
          result['name'], result['args'], result['values']);
    });
  }

  void handleReactionPageResponse() async {
    final result =
        await Navigator.pushNamed(context, "/choose-reaction") as Map;

    if (result == null) {
      return;
    }
    setState(() {
      this._reaction = NewValue(result['serviceTitle'], result['title'],
          result['name'], result['args'], result['values']);
    });
  }

  Widget displayValues(bool isAction) {
    if ((isAction && _action != null) || (!isAction && _reaction != null)) {
      return Text(
        isAction ? _action.title.toLowerCase() : _reaction.title.toLowerCase(),
        style: TextStyle(
          fontSize: 20,
          color: Colors.white,
        ),
      );
    }
    return Text("...", style: TextStyle(fontSize: 20, color: Colors.white));
  }

  void createArea() {
    final UserInfo user = Provider.of<UserInfo>(context, listen: false);
    final Map<String, dynamic> body = {
      'actionService': _action.serviceTitle,
      'actionParameter': _action.values,
      'reactionService': _reaction.serviceTitle,
      'reactionParameter': _reaction.values
    };
    http
        .post(
          "https://back-area.herokuapp.com/area/addAREA",
          headers: {
            "Authorization": user.bearerToken,
            'Content-type': 'application/json'
          },
          body: jsonEncode(body),
        )
        .then(
          (value) => {
            if (value.statusCode == 201)
              {print(value.body), Navigator.pop(context)}
          },
        );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          onTap: handleActionPageResponse,
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            margin: EdgeInsets.symmetric(horizontal: 20),
            width: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.all(Radius.circular(10)),
              color: Colors.grey,
            ),
            child: Row(
              children: [
                Text(
                  "Quand, ",
                  style: TextStyle(
                    fontSize: 20,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                displayValues(true)
              ],
            ),
          ),
        ),
        GestureDetector(
          onTap: handleReactionPageResponse,
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            margin: EdgeInsets.symmetric(horizontal: 20, vertical: 20),
            width: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.all(Radius.circular(10)),
              color: Colors.black,
            ),
            child: Row(
              children: [
                Text(
                  "Alors, ",
                  style: TextStyle(
                    fontSize: 20,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                displayValues(false)
              ],
            ),
          ),
        ),
        IconButton(icon: Icon(Icons.add), onPressed: createArea),
      ],
    );
  }
}

class CreateAreaScreen extends StatefulWidget {
  @override
  _CreateAreaScreenState createState() => _CreateAreaScreenState();
}

class _CreateAreaScreenState extends State<CreateAreaScreen> {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        children: <Widget>[
          TopBar("Création d'AREA", 30),
          SizedBox(height: 30),
          CreateAreaCard(),
        ],
      ),
    );
  }
}
