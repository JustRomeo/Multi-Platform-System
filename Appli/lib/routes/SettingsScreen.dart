import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:area/providers/UserInfo.dart';
import 'package:area/routes/auth.dart';
import 'package:area/components/TopBar.dart';

class SettingsScreen extends StatefulWidget {
  @override
  _SettingsScreenState createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  void disconnect(BuildContext context) {
    final userInfo = Provider.of<UserInfo>(context, listen: false);
    if (userInfo.how == 'google') {
      userInfo.name = '';
      userInfo.email = '';
      userInfo.how = '';
      userInfo.id = '';
      userInfo.isConnected = false;
      userInfo.outlookAccessToken = '';
      userInfo.outlookRefreshToken = '';
      userInfo.spotifyAccessToken = '';
      userInfo.spotifyRefreshToken = '';
      userInfo.intraToken = '';
      userInfo.googleAccessToken = '';
      userInfo.googleRefreshToken = '';
      Navigator.pushNamed(context, '/login');
    } else {
      userInfo.name = '';
      userInfo.email = '';
      userInfo.how = '';
      userInfo.id = '';
      userInfo.isConnected = false;
      userInfo.outlookAccessToken = '';
      userInfo.outlookRefreshToken = '';
      userInfo.spotifyAccessToken = '';
      userInfo.spotifyRefreshToken = '';
      userInfo.intraToken = '';
      userInfo.googleAccessToken = '';
      userInfo.googleRefreshToken = '';
      signOutGoogle();
      Navigator.pushNamed(context, '/login');
    }
  }

  Widget _disconectBtn() {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 25.0),
      width: double.infinity,
      child: RaisedButton(
        color: Color(0xFF880214),
        elevation: 5.0,
        onPressed: () => disconnect(context),
        padding: EdgeInsets.all(15.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30.0),
        ),
        child: Text(
          'DECONNEXION',
          style: TextStyle(
            color: Colors.white,
            letterSpacing: 1.5,
            fontSize: 18.0,
            fontWeight: FontWeight.bold,
            fontFamily: 'Montserrat',
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: <Widget>[
          Container(
            height: double.infinity,
            width: double.infinity,
          ),
          TopBar('Préférences', 40),
          Container(
            height: double.infinity,
            padding: EdgeInsets.symmetric(horizontal: 20, vertical: 150),
            child: SingleChildScrollView(
              child: Column(
                //mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[_disconectBtn()],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
