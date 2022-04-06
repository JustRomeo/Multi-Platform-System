import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:area/components/TopBar.dart';
import 'package:http/http.dart' as http;
import 'package:area/routes/OutlookLogin.dart';
import 'package:area/OutlookParser.dart';
import 'package:provider/provider.dart';
import 'package:area/providers/UserInfo.dart';
import 'package:area/routes/auth.dart';

String getToken(String url) {
  if (url == null) {
    return null;
  }
  final int codeBegin = url.indexOf('?code=') + 6;
  final int codeEnd = url.indexOf('&state');

  return url.substring(codeBegin, codeEnd);
}

class ServicesScreen extends StatefulWidget {
  @override
  _ServicesScreenState createState() => _ServicesScreenState();
}

class _ServicesScreenState extends State<ServicesScreen> {
  void saveOutlookService(OutlookTokens tokens, String email) {
    final UserInfo user = Provider.of<UserInfo>(context, listen: false);
    final Map<String, String> body = {
      'token': tokens.accessToken,
      'refreshToken': tokens.refreshToken,
      'email': email,
    };
    http.post(
      'https://back-area.herokuapp.com/addOutlookToken',
      headers: {
        "Authorization": user.bearerToken,
        'Content-type': 'application/json'
      },
      body: jsonEncode(body),
    ).then((res) {
        final yesSnackBar = SnackBar(content: Text("Vous êtes à présent connecté au service Outlook 😃"));
        Scaffold.of(context).showSnackBar(yesSnackBar);
    });
  }

  void outlookLogin() async {
    final String result = await Navigator.push(context,
        MaterialPageRoute(builder: (context) => OutlookLoginWebPage()));
      final UserInfo userInfo = Provider.of<UserInfo>(context, listen: false);
    final String token = getToken(result);
    final Map<String, String> body = {
      'grant_type': 'authorization_code',
      'client_id': '17b92ba4-e055-4e20-a59c-eef5640371fe',
      'scope':
          'openid profile offline_access https://outlook.office.com/Mail.Read https://outlook.office.com/Mail.Send https://outlook.office.com/Mail.ReadWrite https://outlook.office.com/Calendars.ReadWrite',
      'redirect_uri':
          'https://login.microsoftonline.com/organizations/oauth2/nativeclient',
      'client_secret': '8i435u-YJ5A8efWf3zzq_H_73H_Z9~u~3k',
      'code': token
    };
    if (userInfo.outlookAccessToken == '' || userInfo.outlookAccessToken == null) {
      final yesSnackBar = SnackBar(content: Text("Vous êtes déja connecté au service Outlook 😃"));
        Scaffold.of(context).showSnackBar(yesSnackBar);
    }
    final value = await http.post(
      'https://login.microsoftonline.com/organizations/oauth2/v2.0/token',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: body,
    );
    OutlookTokens tokens = OutlookTokens.fromJson(jsonDecode(value.body));
    final email = await http.get('https://outlook.office.com/api/v2.0/me',
        headers: {'Authorization': 'Bearer ' + tokens.accessToken});
    print(email.body);
    saveOutlookService(tokens, jsonDecode(email.body)['EmailAddress']);
  }

  Widget _outlookBtn() {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 25.0, horizontal: 40),
      width: double.infinity,
      child: RaisedButton(
        color: Color(0xFF6A11F6),
        elevation: 5.0,
        onPressed: () => outlookLogin(),
        padding: EdgeInsets.all(15.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30.0),
        ),
        child: Text(
          'OUTLOOk',
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

  Widget _googleBtn() {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 25.0, horizontal: 40),
      width: double.infinity,
      child: RaisedButton(
        color: Color(0xFF6A11F6),
        elevation: 5.0,
        onPressed: () => googleLogin(context),
        padding: EdgeInsets.all(15.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30.0),
        ),
        child: Text(
          'GOOGLE',
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

  Widget _spotifyBtn() {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 25.0, horizontal: 40),
      width: double.infinity,
      child: RaisedButton(
        color: Color(0xFF6A11F6),
        elevation: 5.0,
        onPressed: () => Navigator.pushNamed(context, '/spotify'),
        padding: EdgeInsets.all(15.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30.0),
        ),
        child: Text(
          'SPOTIFY',
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

  Widget _intraBtn() {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 25.0, horizontal: 40),
      width: double.infinity,
      child: RaisedButton(
        color: Color(0xFF6A11F6),
        elevation: 5.0,
        onPressed: () => Navigator.pushNamed(context, '/intra'),
        padding: EdgeInsets.all(15.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30.0),
        ),
        child: Text(
          'INTRANET EPITECH',
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
          TopBar('Mes Services', 30),
          Container(
            height: double.infinity,
            width: double.infinity,
            //padding: EdgeInsets.symmetric(horizontal: 50),
            padding: EdgeInsets.only(top: 150.0),
            child: SingleChildScrollView(
              child: Column(
                //mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  SizedBox(height: 30.0),
                  _outlookBtn(),
                  _googleBtn(),
                  _spotifyBtn(),
                  _intraBtn(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
