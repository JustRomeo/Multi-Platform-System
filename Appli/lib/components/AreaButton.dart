import 'package:flutter/material.dart';

class AreaButton extends StatelessWidget {
  final String serviceTitle;
  final String title;
  final String name;
  final List<String> args;
  final Function(String, String, String, List<String>) argsCallback;

  AreaButton({
    Key key,
    @required this.serviceTitle,
    @required this.title,
    @required this.name,
    this.args,
    @required this.argsCallback,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        argsCallback(serviceTitle, title, name, args);
      },
      child: Container(
        padding: EdgeInsets.all(10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.all(Radius.circular(10.0)),
          color: Colors.white,
        ),
        child: Text(title),
      ),
    );
  }
}
