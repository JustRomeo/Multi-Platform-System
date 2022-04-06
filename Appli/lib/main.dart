import 'package:area/routes/ChooseReactionScreen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:area/routes/HomeScreen.dart';
import 'package:area/components/NavBar.dart';
import 'package:area/routes/SettingsScreen.dart';
import 'package:area/routes/ServicesScreen.dart';
import 'package:area/routes/LoginScreen.dart';
import 'package:area/routes/RegisterScreen.dart';
import 'package:area/providers/UserInfo.dart';
import 'package:area/routes/CreateAreaScreen.dart';
import 'package:area/routes/ChooseActionScreen.dart';
import 'package:area/routes/ModifyAreaScreen.dart';
import 'package:area/routes/IntraScreen.dart';
import 'package:area/routes/SpotifyLogin.dart';

void main() {
  runApp(ChangeNotifierProvider<UserInfo>(
      create: (context) => UserInfo(), child: MyApp()));
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Action.',
      theme: ThemeData(
        primarySwatch: Colors.purple,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      builder: (context, child) {
        return Scaffold(
          body: child,
        );
      },
      initialRoute: '/login',
      routes: {
        '/spotify': (context) => SpotifyLoginButton(),
        '/intra': (context) => IntraScreen(),
        '/nav': (context) => Nav(),
        '/home': (context) => HomeScreen(),
        '/settings': (context) => SettingsScreen(),
        '/services': (context) => ServicesScreen(),
        '/login': (context) => LoginPage(),
        '/register': (context) => RegisterPage(),
        '/create-area': (context) => CreateAreaScreen(),
        '/choose-action': (context) => ChooseActionScreen(),
        '/choose-reaction': (context) => ChooseReactionScreen(),
        '/modify-area': (context) => ModifyAreaScreen()
      },
      debugShowCheckedModeBanner: false,
    );
  }
}
