import 'package:flutter/material.dart';

class TopBar extends StatelessWidget {
  TopBar(this.title, this.fontSize);

  final String title;
  final double fontSize;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 150.0,
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(25)),
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF6A11F6), Color(0xFF9929EA)],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black54,
            offset: Offset(0, 0.75),
            blurRadius: 15.0,
          ),
        ],
      ),
      child: Center(
        child: Text(
          this.title,
          style: TextStyle(
            fontSize: fontSize,
            fontFamily: 'Montserrat',
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}
