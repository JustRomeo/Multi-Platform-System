import 'package:area/Area.dart';
import 'package:flutter/material.dart';

import 'package:area/components/AreaButton.dart';

class AreaList extends StatelessWidget {
  final Function cb;
  final String title;
  final List<AAction> actions;
  final List<AReaction> reactions;
  final bool isAction;

  AreaList({
    Key key,
    this.cb,
    @required this.title,
    this.actions,
    this.reactions,
    @required this.isAction,
  });

  List<Widget> _setActionWidgetList() {
    List<Widget> widgets = [];

    for (final AAction action in actions) {
      if (action.name != null) {
        widgets.add(AreaButton(
          serviceTitle: title,
          title: action.title,
          name: action.name,
          args: action.args,
          argsCallback: cb,
        ));
        widgets.add(SizedBox(height: 10));
      }
    }
    return widgets;
  }

  List<Widget> _setReactionWidgetList() {
    List<Widget> widgets = [];

    for (final AReaction reaction in reactions) {
      if (reaction.name != null) {
        widgets.add(AreaButton(
          serviceTitle: title,
          title: reaction.title,
          name: reaction.name,
          args: reaction.args,
          argsCallback: cb,
        ));
        widgets.add(SizedBox(height: 10));
      }
    }
    return widgets;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: EdgeInsets.symmetric(horizontal: 20),
      padding: EdgeInsets.all(10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.all(Radius.circular(10.0)),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF388BFF), Color(0xFF120BD9)],
        ),
      ),
      child: Theme(
        data: ThemeData(
          accentColor: Colors.white,
          unselectedWidgetColor: Colors.white,
        ),
        child: ExpansionTile(
          title: Text(
            title,
            style: TextStyle(color: Colors.white),
          ),
          children:
              isAction ? _setActionWidgetList() : _setReactionWidgetList(),
        ),
      ),
    );
  }
}
