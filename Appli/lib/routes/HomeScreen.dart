import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import 'package:area/components/AreaCard.dart';
import 'package:area/components/TopBar.dart';
import 'package:area/Area.dart';
import 'package:area/providers/UserInfo.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Widget> _areasWidgets = [];
  List<Area> _areas = [];
  List<AReactionList> _reactions;
  List<AActionList> _actions;

  Future<http.Response> fetchAreas() async {
    final UserInfo user = Provider.of<UserInfo>(context, listen: false);
    try {
      return await http.get('https://back-area.herokuapp.com/area/getUserArea',
          headers: {'Authorization': user.bearerToken});
    } catch (e) {
      print(e);
      return null;
    }
  }

  AAction getActionFromName(String name) {
    for (final AActionList actionList in _actions) {
      for (final AAction action in actionList.actions) {
        if (action.name == name) {
          return action;
        }
      }
    }
    return null;
  }

  AReaction getReactionFromName(String name) {
    for (final AReactionList reactionList in _reactions) {
      for (final AReaction reaction in reactionList.reactions) {
        if (reaction.name == name) {
          return reaction;
        }
      }
    }
    return null;
  }

  void setAreas() async {
    final response = await fetchAreas();

    if (response == null) {
      return;
    }
    if (response.statusCode == 200) {
      final dataJson = jsonDecode(response.body) as List;
      List<Area> areas = dataJson.map((data) => Area.fromJson(data)).toList();
      List<Widget> widgets = [];

      for (final Area area in areas) {
        final AAction action = getActionFromName(area.actionParamsValues[0]);
        final AReaction reaction =
            getReactionFromName(area.reactionParamsValues[0]);
        area.actionName = action.name;
        area.actionTitle = action.title;
        area.reactionTitle = reaction.title;
        area.reactionName = reaction.name;
        area.actionParams = action.args;
        area.reactionParams = reaction.args;
      }
      widgets = areas.map((area) => AreaCard(area: area)).toList();
      setState(() {
        _areasWidgets = widgets;
      });
    }
  }

  void getActionsAndReactions() async {
    final String response =
        await rootBundle.loadString('assets/json/area.json');
    final actionData = jsonDecode(response)['actions'] as List;
    final reactionData = jsonDecode(response)['reactions'] as List;
    final List<AActionList> actionsLists = actionData
        .map((actionListJson) => AActionList.fromJson(actionListJson))
        .toList();
    final List<AReactionList> reactionsLists = reactionData
        .map((reactionListJson) => AReactionList.fromJson(reactionListJson))
        .toList();

    setState(() {
      _actions = actionsLists;
      _reactions = reactionsLists;
    });
  }

  @override
  void initState() {
    super.initState();

    setAreas();
    getActionsAndReactions();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: () {
          Navigator.pushNamed(context, '/create-area');
        },
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                TopBar("Mes Actions.", 40),
                //IconButton(icon: Icon(Icons.add), onPressed: outlookLogin),
                _areasWidgets.length == 0
                    ? Center(child: Text("Vous n'avez aucune AREA :("))
                    : Container(),
                ..._areasWidgets,
              ],
            ),
          ),
        ],
      ),
    );
  }
}
