import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'package:area/components/TopBar.dart';
import 'package:area/components/AreaList.dart';
import 'package:area/Area.dart';
import 'package:area/routes/SetupAreaScreen.dart';

class ChooseReactionScreen extends StatefulWidget {
  @override
  _ChooseReactionScreenState createState() => _ChooseReactionScreenState();
}

class _ChooseReactionScreenState extends State<ChooseReactionScreen> {
  List<AReactionList> _reactionsLists = [];

  selectReaction(String serviceTitle, String title, String name,
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
      "name": name,
      'args': arguments,
      'values': result
    });
  }

  Future<List<AReactionList>> readJson() async {
    final String response =
        await rootBundle.loadString('assets/json/area.json');
    final data = jsonDecode(response)['reactions'] as List;
    List<AReactionList> reactionsLists = data
        .map((reactionListJson) => AReactionList.fromJson(reactionListJson))
        .toList();
    return reactionsLists;
  }

  List<Widget> _buildWidgetList() {
    List<Widget> widgets = [];

    widgets.add(TopBar("Choisir une Reaction", 30));
    for (AReactionList reactionsList in _reactionsLists) {
      widgets.add(SizedBox(
        height: 20,
      ));
      widgets.add(AreaList(
        title: reactionsList.name,
        reactions: reactionsList.reactions,
        cb: selectReaction,
        isAction: false,
      ));
    }
    return widgets;
  }

  @override
  void initState() {
    super.initState();
    readJson().then((value) => setState(() {
          _reactionsLists = value;
        }));
  }

  Widget build(BuildContext context) {
    return ListView(
      padding: EdgeInsets.zero,
      children: _buildWidgetList(),
    );
  }
}
