import 'dart:math';
import 'package:flutter/material.dart';

import 'package:area/Area.dart';

List<Color> getRandomColorPair() {
  List colors = [
    [Colors.yellow, Colors.red],
    [Colors.pink[200], Colors.purple],
    [Colors.cyanAccent, Colors.blue],
    [Colors.indigoAccent, Colors.indigo],
  ];
  return colors[Random().nextInt(colors.length)];
}

class AreaCard extends StatefulWidget {
  final Area area;
  final IconData actionIcon;
  final IconData reactionIcon;

  const AreaCard({
    Key key,
    @required this.area,
    this.actionIcon = Icons.keyboard_arrow_right,
    this.reactionIcon = Icons.keyboard_arrow_left,
  });

  @override
  _AreaCardState createState() => _AreaCardState();
}

class _AreaCardState extends State<AreaCard> {
  final TextStyle _textStyle = TextStyle(
    color: Colors.white,
    fontFamily: 'Montserrat',
    fontSize: 16.0,
  );

  void handleTap() {
    Navigator.pushNamed(context, '/modify-area', arguments: widget.area);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: handleTap,
      child: Container(
        padding: EdgeInsets.all(20),
        margin: EdgeInsets.only(top: 25, left: 25, right: 25),
        height: 120.0,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.all(Radius.circular(10.0)),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: getRandomColorPair(),
          ),
        ),
        child: Stack(
          children: [
            Positioned(
              left: -26.0,
              top: -26.0,
              child: Container(
                width: 20.0,
                height: 20.0,
                decoration: BoxDecoration(
                  color: Colors.green,
                  shape: BoxShape.circle,
                ),
              ),
            ),
            Row(
              children: [
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.area.actionTitle,
                        style: _textStyle,
                      ),
                      Text(
                        widget.area.reactionTitle,
                        style: _textStyle,
                      )
                    ],
                  ),
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      widget.actionIcon,
                      size: 40,
                      color: Colors.white,
                    ),
                    Icon(
                      widget.reactionIcon,
                      size: 40,
                      color: Colors.white,
                    )
                  ],
                )
              ],
            )
          ],
          overflow: Overflow.visible,
        ),
      ),
    );
  }
}
