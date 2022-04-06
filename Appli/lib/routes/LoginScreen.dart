import 'package:area/routes/HomeScreen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:provider/provider.dart';
import 'package:area/providers/UserInfo.dart';
import 'package:area/routes/auth.dart';
import 'package:area/main.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

Response responseFromJson(String str) => Response.fromJson(json.decode(str));

String responseToJson(Response data) => json.encode(data.toJson());

class Response {
  Response({
    this.user,
    this.token,
  });

  User user;
  String token;

  factory Response.fromJson(Map<String, dynamic> json) => Response(
        user: User.fromJson(json["user"]),
        token: json["token"],
      );

  Map<String, dynamic> toJson() => {
        "user": user.toJson(),
        "token": token,
      };
}

class User {
  User({
    this.id,
    this.name,
    this.email,
    this.password,
  });

  String id;
  String name;
  String email;
  String password;

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json["_id"],
        name: json["username"],
        email: json["email"],
        password: json["password"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "name": name,
        "email": email,
        "password": password,
      };
}

class _LoginPageState extends State<LoginPage> {
  TextEditingController emailController = new TextEditingController();
  TextEditingController passwordController = new TextEditingController();

  void logIn() async {
    final wrongSnackBar = SnackBar(
        content: Text("Password or email do not match, please try again ❌"));
    final userInfo = Provider.of<UserInfo>(context, listen: false);
    String url = "https://back-area.herokuapp.com/login";

    Map data = {
      "email": emailController.text,
      "password": passwordController.text,
    };
    String body = json.encode(data);

    if (userInfo.isConnected == true) {
      final goodSnackBar =
          SnackBar(content: Text("Welcome " + userInfo.name + " ! 😃"));
      Scaffold.of(context).showSnackBar(goodSnackBar);
      Navigator.pushNamed(context, '/nav');
    }

    await http
        .post(url, headers: {"Content-Type": "application/json"}, body: body)
        .then((res) {
      /* Test*/ print('Response from backend: ' + res.body);
      if (res.statusCode == 404) {
        Scaffold.of(context).showSnackBar(wrongSnackBar);
        print('RESPONSE FOR LOGIN: ERROR IN LOGIN ARGS');
        return;
      } else {
        final response = responseFromJson(res.body.toString());
        final goodSnackBar =
            SnackBar(content: Text("Welcome " + response.user.name + " ! 😃"));
        userInfo.bearerToken = response.token.toString();
        userInfo.name = response.user.name.toString();
        userInfo.email = response.user.email.toString();
        userInfo.id = response.user.id.toString();
        userInfo.isConnected = true;
        userInfo.how = 'login';
        Scaffold.of(context).showSnackBar(goodSnackBar);
        Navigator.pushNamed(context, '/nav');
      }
    });
  }

  Widget _emailBox() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text('Email',
            style: TextStyle(color: Colors.white54, fontFamily: 'Montserrat')),
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
              hintStyle:
                  TextStyle(color: Colors.white54, fontFamily: 'Montserrat'),
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
        Text('Password',
            style: TextStyle(color: Colors.white54, fontFamily: 'Montserrat')),
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
              hintStyle:
                  TextStyle(color: Colors.white54, fontFamily: 'Montserrat'),
            ),
          ),
        )
      ],
    );
  }

  Widget _loginBtn() {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 25.0),
      width: double.infinity,
      child: RaisedButton(
        elevation: 5.0,
        onPressed: () => logIn(),
        padding: EdgeInsets.all(15.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30.0),
        ),
        color: Colors.white,
        child: Text(
          'LOGIN',
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

  Widget _signInWith() {
    return Column(
      children: <Widget>[
        Text(
          '- OR -',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w400,
          ),
        ),
        SizedBox(height: 20.0),
        Text(
          'Sign in with',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontFamily: 'MontSerrat',
          ),
        ),
      ],
    );
  }

  Widget _oauthBtn(Function onTap, AssetImage logo) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 60.0,
        width: 60.0,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black26,
              offset: Offset(0, 2),
              blurRadius: 6.0,
            ),
          ],
          image: DecorationImage(
            image: logo,
          ),
        ),
      ),
    );
  }

  Widget _oauthBtnRow() {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 30.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          _oauthBtn(
            () => signInWithGoogle(context),
            AssetImage(
              'assets/icons/google.jpg',
            ),
          ),
        ],
      ),
    );
  }

  Widget _signupBtn() {
    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, '/register'),
      child: RichText(
        text: TextSpan(
          children: [
            TextSpan(
              text: 'Don\'t have an Account? ',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18.0,
                fontWeight: FontWeight.w400,
              ),
            ),
            TextSpan(
              text: 'Sign Up',
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
    final userInfo = Provider.of<UserInfo>(context, listen: false);
    if (userInfo.isConnected == true) {
      Navigator.pushNamed(context, '/nav');
    }
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
                    'Sign In',
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'Montserrat',
                      fontSize: 30.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 30.0),
                  _emailBox(),
                  SizedBox(
                    height: 30.0,
                  ),
                  _passwordBox(),
                  _loginBtn(),
                  _signInWith(),
                  _oauthBtnRow(),
                  _signupBtn(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
