import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:area/components/TopBar.dart';
import 'package:provider/provider.dart';
import 'package:area/providers/UserInfo.dart';


class IntraScreen extends StatefulWidget {
  IntraScreen({Key key}) : super(key: key);

  @override
  _IntraScreenState createState() => _IntraScreenState();
}

class _IntraScreenState extends State<IntraScreen> {

  TextEditingController txtController = new TextEditingController();
  TextEditingController emailController = new TextEditingController();

  void Register () async {
    final userInfo = Provider.of<UserInfo>(context, listen: false);
    userInfo.intraToken = txtController.text;
    userInfo.intraMail = emailController.text;
    final Map<String, String> body = {
      'token': txtController.text,
      'email': emailController.text,
    };
    await http.post(
      'https://back-area.herokuapp.com/addIntraToken',
      headers: {"Authorization": userInfo.bearerToken, 'Content-type': 'application/json'},
      body: jsonEncode(body),
      ).then((res) {
        if (res.statusCode == 200) {
          Navigator.pushNamed(context, '/intra');
        } else {
        final wrongSnackBar = SnackBar(content: Text("Erreur. Veuillez verifier vos entrées et recommencer ❌"));
        Scaffold.of(context).showSnackBar(wrongSnackBar);
        }
      });
  }

  Widget _txtBox() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text (
          'Token intranet',
          style: TextStyle(
            color: Color(0xFF000000),
            fontFamily: 'Montserrat'
          )
        ),
        SizedBox(height: 10.0),
        Container(
          alignment: Alignment.centerLeft,
          decoration: BoxDecoration(
            color: Color(0xFF6C15CF),
            borderRadius: BorderRadius.circular(10.0),
            boxShadow: [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 6.0,
                offset: Offset(0, 2),
              ),
            ],
          ),
          height: 60.0,
          child: TextField(
            controller: txtController,
            keyboardType: TextInputType.emailAddress,
            style: TextStyle(
              color: Colors.white,
              fontFamily: 'Montserrat',
            ),
            decoration: InputDecoration(
              border: InputBorder.none,
              contentPadding: EdgeInsets.only(top: 14.0),
              prefixIcon: Icon(
                Icons.settings,
                color: Colors.white,
              ),
              hintText: 'Entrer votre token d\'autologin',
              hintStyle: TextStyle(
                color: Colors.white54,
                fontFamily: 'Montserrat'
              ),
            ),
          ),
        ),
        SizedBox(height: 10.0),
        Text (
          'Rendez-vous dans la partie administration de votre intranet, cliquez sur : "generate autologin link", et copiez le token (sans la partie "https://intra.epitech.eu/".',
          style: TextStyle(
            color: Color(0xFF000000),
            fontFamily: 'Montserrat'
          )
        ),
      ],
    );
  }

  Widget _mailBox() {
    return Column(
            // padding: EdgeInsets.symmetric(vertical: 25.0, horizontal: 40),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text (
          'Email',
          style: TextStyle(
            color: Color(0xFF000000),
            fontFamily: 'Montserrat'
          )
        ),
        SizedBox(height: 10.0),
        Container(
          alignment: Alignment.centerLeft,
          decoration: BoxDecoration(
            color: Color(0xFF6C15CF),
            borderRadius: BorderRadius.circular(10.0),
            boxShadow: [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 6.0,
                offset: Offset(0, 2),
              ),
            ],
          ),
          height: 60.0,
          child: TextField(
            controller: emailController,
            keyboardType: TextInputType.emailAddress,
            style: TextStyle(
              color: Colors.white,
              fontFamily: 'Montserrat',
            ),
            decoration: InputDecoration(
              border: InputBorder.none,
              contentPadding: EdgeInsets.only(top: 14.0),
              prefixIcon: Icon(
                Icons.email,
                color: Colors.white,
              ),
              hintText: 'Entrer votre mail Epitech',
              hintStyle: TextStyle(
                color: Colors.white54,
                fontFamily: 'Montserrat'
              ),
            ),
          ),
        )
      ],
    );
  }

  Widget _saveBtn() {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 25.0),
      width: double.infinity,
      child: RaisedButton(
        elevation: 5.0,
        onPressed: () => Register(),
        padding: EdgeInsets.all(15.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30.0),
        ),
        color: Color(0xFF6C15CF),
        child: Text(
          'ENREGISTRER',
          style: TextStyle(
            color: Color(0xFFFFFFFF),
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
              TopBar('Connexion à l\'intranet', 30),
              Container(
                height: double.infinity,
                width: double.infinity,
                padding: EdgeInsets.symmetric(horizontal: 20, vertical: 40),
                child: SingleChildScrollView(
                child: Column(
                    //mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      SizedBox(height: 140.0),
                      _txtBox(),
                      SizedBox(height: 40.0),
                      _mailBox(),
                      SizedBox(height: 30.0),
                      _saveBtn(),
                    ],
                  ),
                ),
                ),
            ],
          ),
    );
  }
}