import 'package:flutter/material.dart';

class UploadTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        children: [
          TextField(
            decoration: InputDecoration(
              labelText: 'Entrez votre texte ici...',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 16),
          ElevatedButton(
            onPressed: null,
            child: Text("Traiter le contenu"),
          ),
        ],
      ),
    );
  }
}
