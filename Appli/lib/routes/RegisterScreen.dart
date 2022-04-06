import 'package:area/routes/LoginScreen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RegisterPage extends StatefulWidget {
  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  TextEditingController emailController = new TextEditingController();
  TextEditingController passwordController = new TextEditingController();
  TextEditingController usernameController = new TextEditingController();

void register() async {
  final registeredSnackBar = SnackBar(content: Text("account registered ✅"));
  final mailSnackBar = SnackBar(content: Text("an account with this mail already exist ❌"));
  final emptySnackBar = SnackBar(content: Text("Please fill all the textfields ❌"));

  if (usernameController.text == '' || emailController.text == '' || passwordController.text == '') {
    Scaffold.of(context).showSnackBar(emptySnackBar);
    return;
  }
    String url = "https://back-area.herokuapp.com/register";
    Map data = {
      "username": usernameController.text,
      "email": emailController.text,
      "password": passwordController.text,
    };
    String body = json.encode(data);

  await http.post(
    url,
    headers: {"Content-Type": "application/json"},
    body: body)
    .then((res) {
      if (res.statusCode == 400) {
        Scaffold.of(context).showSnackBar(mailSnackBar);
        print('Error during registering new user.');
        return;
      } else {
        Scaffold.of(context).showSnackBar(registeredSnackBar);
        print('User registered.');
        Navigator.pushNamed(context, '/login');
      }
    });
}

  Widget _usernameBox() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text (
          'Username',
          style: TextStyle(
            color: Colors.white54,
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
            controller: usernameController,
            keyboardType: TextInputType.emailAddress,
            style: TextStyle(
              color: Colors.white,
              fontFamily: 'Montserrat',
            ),
            decoration: InputDecoration(
              border: InputBorder.none,
              contentPadding: EdgeInsets.only(top: 14.0),
              prefixIcon: Icon(
                Icons.person,
                color: Colors.white,
              ),
              hintText: 'Enter your user name',
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

  Widget _emailBox() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text (
          'Email',
          style: TextStyle(
            color: Colors.white54,
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
              hintText: 'Enter your Email',
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

  Widget _passwordBox() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text (
          'Password',
          style: TextStyle(
            color: Colors.white54,
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
            controller: passwordController,
            obscureText: true,
            style: TextStyle(
              color: Colors.white,
              fontFamily: 'Montserrat',
            ),
            decoration: InputDecoration(
              border: InputBorder.none,
              contentPadding: EdgeInsets.only(top: 14.0),
              prefixIcon: Icon(
                Icons.lock,
                color: Colors.white,
              ),
              hintText: 'Enter your password',
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

Widget _registerBtn() {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 25.0),
      width: double.infinity,
      child: RaisedButton(
        elevation: 5.0,
        onPressed: () => register(),
        padding: EdgeInsets.all(15.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30.0),
        ),
        color: Colors.white,
        child: Text(
          'SIGN UP',
          style: TextStyle(
            color: Color(0xFF6C15CF),
            letterSpacing: 1.5,
            fontSize: 18.0,
            fontWeight: FontWeight.bold,
            fontFamily: 'Montserrat',
          ),
        ),
      ),
    );
  }

  Widget _loginpageBtn() {
    return GestureDetector(
      onTap: () => Navigator.pop(context),
      child: RichText(
        text: TextSpan(
          children: [
            TextSpan(
              text: 'Already have an Account? ',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18.0,
                fontWeight: FontWeight.w400,
              ),
            ),
            TextSpan(
              text: 'Log in!',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
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
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Color(0xFF6a11f6),
                      Color(0xFF9929ea),
                    ],
                  ),
                ),
              ),
              Container(
                height: double.infinity,
                padding: EdgeInsets.symmetric(horizontal: 20, vertical: 40),
                child: SingleChildScrollView(
                child: Column(
                    //mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      Text(
                        'Register',
                        style: TextStyle(
                          color: Colors.white,
                          fontFamily: 'Montserrat',
                          fontSize: 30.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 30.0),
                      _usernameBox(),
                      SizedBox(height: 30.0),
                      _emailBox(),
                      SizedBox(height: 30.0),
                      _passwordBox(),
                      _registerBtn(),
                      _loginpageBtn(),
                    ],
                  ),
                ),
              ),
            ],
          ),
    );
  }
}