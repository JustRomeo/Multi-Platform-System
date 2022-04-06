import 'package:flutter/material.dart';

class UserInfo with ChangeNotifier {
  String how = "";
  String id = "";
  String name = "";
  String email = "";
  String bearerToken = "";
  String googleAccessToken = "";
  String googleRefreshToken = "";
  bool isConnected = false;
  String outlookAccessToken = "";
  String outlookRefreshToken = "";
  String spotifyAccessToken = "";
  String spotifyRefreshToken = "";
  String intraToken = "";
  String intraMail = "";

  void addUserInfo(String name, String email, String token) {
    how = how;
    id = id;
    name = name;
    email = email;
    bearerToken = token;
    googleAccessToken = googleAccessToken;
    googleRefreshToken = googleRefreshToken;
    isConnected = isConnected;
    outlookAccessToken =  outlookAccessToken;
  }
}