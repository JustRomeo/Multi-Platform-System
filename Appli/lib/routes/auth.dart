
import 'dart:convert';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:area/providers/UserInfo.dart' as UserData;
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';

Response responseFromJson(String str) => Response.fromJson(json.decode(str));

String responseToJson(Response data) => json.encode(data.toJson());

class Response {
    Response({
        this.user,
        this.token,
    });

    HomeUser user;
    String token;

    factory Response.fromJson(Map<String, dynamic> json) => Response(
        user: HomeUser.fromJson(json["user"]),
        token: json["token"],
    );

    Map<String, dynamic> toJson() => {
        "user": user.toJson(),
        "token": token,
    };
}

class HomeUser {
    HomeUser({
        this.id,
        this.name,
        this.email,
        this.password,
    });

    String id;
    String name;
    String email;
    String password;

    factory HomeUser.fromJson(Map<String, dynamic> json) => HomeUser(
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

  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://mail.google.com/",
    "https://www.googleapis.com/auth/youtube",
    ],
  );

  void googleLogin (BuildContext context) async {
    final userInfo = Provider.of<UserData.UserInfo>(context, listen: false);
    final alreadySnackBar = SnackBar(content: Text("Vous êtes déja connecté à ce service."));
    final wrongSnackBar = SnackBar(content: Text("Nous n'avons pas réussi à vous connecter, veuillez réesayer ❌"));
    if (userInfo.how == 'google') {
      Scaffold.of(context).showSnackBar(alreadySnackBar);
      return;
    } else {
      await Firebase.initializeApp();
      final GoogleSignInAccount _googleSignInAccount = await _googleSignIn.signIn();
      final GoogleSignInAuthentication _googleSignInAuthentication = await _googleSignInAccount.authentication;

      final AuthCredential _credential = GoogleAuthProvider.credential(
        accessToken: _googleSignInAuthentication.accessToken,
        idToken: _googleSignInAuthentication.idToken,
      );

      final UserCredential _authResult = await _auth.signInWithCredential(_credential);
      final User _user = _authResult.user;

      if (_user != null) {
        assert(!_user.isAnonymous);
        assert(await _user.getIdToken() != null);
        final User currentUser = _auth.currentUser;
        assert(_user.uid == currentUser.uid);
        final Map<String, String> body = {
          'service': 'google',
          'email': _googleSignInAccount.email,
          'token': _googleSignInAuthentication.accessToken,
          'refreshToken': 'null'
      };
      http.post(
        'https://back-area.herokuapp.com/addServiceToken',
        headers: {'Authorization': userInfo.bearerToken},
        body: body,
        ).then((res) {
          if (res.statusCode == 200) {
            final goodSnackBar = SnackBar(content: Text("Vous êtes à présent connecté au service Google 😃"));
            Scaffold.of(context).showSnackBar(goodSnackBar);
          } else {
            Scaffold.of(context).showSnackBar(wrongSnackBar);
          }
        });
      } else {
        Scaffold.of(context).showSnackBar(wrongSnackBar);
      }
    }
  }

  Future<String> signInWithGoogle(BuildContext context) async {
    final wrongSnackBar = SnackBar(content: Text("Nous n'avons pas réussi à vous connecter, veuillez réesayer ❌"));
    final userInfo = Provider.of<UserData.UserInfo>(context, listen: false);
    await Firebase.initializeApp();
    final GoogleSignInAccount _googleSignInAccount = await _googleSignIn.signIn();
    final GoogleSignInAuthentication _googleSignInAuthentication = await _googleSignInAccount.authentication;

    final AuthCredential _credential = GoogleAuthProvider.credential(
      accessToken: _googleSignInAuthentication.accessToken,
      idToken: _googleSignInAuthentication.idToken,
    );

    final UserCredential _authResult = await _auth.signInWithCredential(_credential);
    final User _user = _authResult.user;

    if (_user != null) {
      assert(!_user.isAnonymous);
      assert(await _user.getIdToken() != null);

      final User currentUser = _auth.currentUser;
      assert(_user.uid == currentUser.uid);
      userInfo.email = _googleSignInAccount.email;
      userInfo.name = _googleSignInAccount.displayName;
      userInfo.how = 'google';
      userInfo.id = _googleSignInAccount.id;
      userInfo.googleAccessToken = _googleSignInAuthentication.accessToken;
      userInfo.googleRefreshToken = '';
      /*TEST*/print('google access token: ');
      final Map<String, String> body = {
        'service': 'google',
        'email': userInfo.email,
        'id': userInfo.id,
        'displayName': userInfo.name,
        'token': userInfo.googleAccessToken,
        'refreshToken': 'null'
      };
      http.post(
        'https://back-area.herokuapp.com/mobileRegistration',
        headers: {'Content-type': 'application/json'},
         body: jsonEncode(body),
      ).then((res) {
        if (res.statusCode == 404) {
          Scaffold.of(context).showSnackBar(wrongSnackBar);
           print('RESPONSE FOR LOGIN: ERROR IN LOGIN ARGS');
           return;
        } else {
          final response = responseFromJson(res.body.toString());
          userInfo.bearerToken = response.token.toString();
          final goodSnackBar = SnackBar(content: Text("Welcome " + _googleSignInAccount.displayName + " ! 😃"));
          Scaffold.of(context).showSnackBar(goodSnackBar);
          Navigator.pushNamed(context, '/nav');
        }
      });
      
    } else {
      Scaffold.of(context).showSnackBar(wrongSnackBar);
    }
    return null;
  }

  void signOutGoogle() async {
    await _googleSignIn.signOut();
  }