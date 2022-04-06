import 'package:flutter/material.dart';
import 'package:area/routes/HomeScreen.dart';
import 'package:area/routes/CreateAreaScreen.dart';
import 'package:area/routes/SettingsScreen.dart';
import 'package:area/routes/ServicesScreen.dart';

class Nav extends StatefulWidget {
  Nav({Key key}) : super(key: key);

  @override
  _NavState createState() => _NavState();
}

class _NavState extends State<Nav> {
  int _selectedIndex = 1;

  List<Widget> _widgetOptions = <Widget>[
    ServicesScreen(),
    HomeScreen(),
    SettingsScreen()
  ];

  void _onItemTap(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
              icon: Icon(Icons.check_box), label: 'Mes services'),
          BottomNavigationBarItem(
              icon: Icon(Icons.computer), label: 'Mes actions'),
          BottomNavigationBarItem(
              icon: Icon(Icons.settings), label: 'Préférences'),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTap,
      ),
    );
  }
}
