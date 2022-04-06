import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'package:area/components/TopBar.dart';
import 'package:area/components/AreaList.dart';
import 'package:area/Area.dart';
import 'package:area/routes/SetupAreaScreen.dart';

class ChooseActionScreen extends StatefulWidget {
  @override
  _ChooseActionScreenState createState() => _ChooseActionScreenState();
}

class _ChooseActionScreenState extends State<ChooseActionScreen> {
  List<AActionList> _actionsLists = [];

  selectAction(String serviceTitle, String title, String name,
      List<String> arguments) async {
    if (arguments == null || arguments.length == 0) {
      Navigator.pop(context, {
        'serviceTitle': serviceTitle,
        'title': title,
        'name': name,
        'args': null,
        'values': null
      });
      return;
    }
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SetupAreaScreen(
          title: title,
          args: arguments,
        ),
      ),
    );
    Navigator.pop(context, {
      'serviceTitle': serviceTitle,
      'title': title,
      'name': name,
      'args': arguments,
      'values': result
    });
  }

  Future<List<AActionList>> readJson() async {
    final String response =
        await rootBundle.loadString('assets/json/area.json');
    final data = jsonDecode(response)['actions'] as List;
    List<AActionList> actionsLists = data
        .map((actionListJson) => AActionList.fromJson(actionListJson))
        .toList();
    return actionsLists;
  }

  List<Widget> _buildWidgetList() {
    List<Widget> widgets = [];

    widgets.add(TopBar("Choisir une Action", 30));
    for (AActionList actionsList in _actionsLists) {
      widgets.add(SizedBox(height: 20));
      widgets.add(AreaList(
        title: actionsList.name,
        actions: actionsList.actions,
        cb: selectAction,
        isAction: true,
      ));
    }
    return widgets;
  }

  @override
  void initState() {
    readJson().then((value) => setState(() {
          _actionsLists = value;
        }));
    super.initState();
  }

  Widget build(BuildContext context) {
    return ListView(
      padding: EdgeInsets.zero,
      children: _buildWidgetList(),
    );
  }
}
