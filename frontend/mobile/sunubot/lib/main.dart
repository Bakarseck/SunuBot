import 'package:flutter/material.dart';
import 'screens/sunubot_interface.dart';

void main() => runApp(SUNUBOTApp());

class SUNUBOTApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SUNUBOT',
      theme: ThemeData(
        primarySwatch: Colors.orange,
      ),
      home: SUNUBOTInterface(),
    );
  }
}
