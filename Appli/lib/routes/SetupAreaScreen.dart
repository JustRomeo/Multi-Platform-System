import "package:flutter/material.dart";
import "package:area/components/TopBar.dart";

class SetupAreaScreen extends StatefulWidget {
  final String title;
  final List<String> args;

  SetupAreaScreen({Key key, this.title, this.args});

  @override
  _SetupAreaScreenState createState() => _SetupAreaScreenState();
}

class _SetupAreaScreenState extends State<SetupAreaScreen> {
  List<TextEditingController> _controllers = [];
  List<Widget> _widgets;

  List<Widget> initArgs() {
    List<Widget> widgets = [];

    for (final arg in widget.args) {
      TextEditingController controller = TextEditingController();
      _controllers.add(controller);
      widgets.add(SizedBox(height: 20));
      widgets.add(TextField(
        controller: controller,
        decoration: InputDecoration(labelText: arg),
      ));
    }
    return widgets;
  }

  void handleSubmit() {
    List<String> values = [];

    for (final controller in _controllers) {
      if (controller.text == null || controller.text == "") {
        return;
      }
      values.add(controller.text);
    }
    Navigator.pop(context, values);
  }

  @override
  void initState() {
    super.initState();
    this.setState(() {
      this._widgets = initArgs();
    });
  }

  @override
  void dispose() {
    super.dispose();
    for (final controller in _controllers) {
      controller.dispose();
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        TopBar("Action", 40),
        SizedBox(
          height: 20,
        ),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 30),
          child: Row(children: [Text("Quand: " + widget.title)]),
        ),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 30),
          child: Column(
            children: _widgets,
          ),
        ),
        SizedBox(height: 30),
        IconButton(
          icon: Icon(
            Icons.add,
            color: Colors.green,
          ),
          onPressed: handleSubmit,
        )
      ],
    );
  }
}
