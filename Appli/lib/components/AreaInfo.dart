import 'package:flutter/material.dart';

class AreaInfo extends StatefulWidget {
  final bool isAction;
  final String text;
  final String title;
  final List<String> argsTitles;
  final Color color;
  final Function callback;

  AreaInfo({
    @required this.isAction,
    @required this.text,
    @required this.title,
    this.argsTitles,
    @required this.color,
    this.callback,
  });

  @override
  _AreaInfoState createState() => _AreaInfoState();
}

class _AreaInfoState extends State<AreaInfo> {
  void handleTap() async {
    if (widget.isAction) {
      final res = await Navigator.pushNamed(context, '/choose-action') as Map;
      if (res == null) {
        return;
      }
      widget.callback(
        res['serviceTitle'],
        res['title'],
        res['name'],
        res['args'],
        res['values'],
      );
    } else {
      final res = await Navigator.pushNamed(context, '/choose-reaction') as Map;
      if (res == null) {
        return;
      }
      widget.callback(
        res['serviceTitle'],
        res['title'],
        res['name'],
        res['args'],
        res['values'],
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: handleTap,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        margin: EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        width: double.infinity,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.all(Radius.circular(10)),
          color: widget.color,
        ),
        child: Column(
          children: [
            Row(
              children: [
                Text(
                  widget.text,
                  style: TextStyle(
                    fontSize: 20,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                widget.title != null
                    ? Text(
                        widget.title.toLowerCase(),
                        style: TextStyle(fontSize: 20, color: Colors.white),
                      )
                    : Text(
                        '...',
                        style: TextStyle(fontSize: 20, color: Colors.white),
                      )
              ],
            )
          ],
        ),
      ),
    );
  }
}
