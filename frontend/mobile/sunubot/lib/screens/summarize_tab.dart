import 'package:flutter/material.dart';

class SummarizeTab extends StatelessWidget {
  final String summary;
  final Function(String) setSummary;

  SummarizeTab({required this.summary, required this.setSummary});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        children: [
          Text("Résumé", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          TextField(
            maxLines: 5,
            readOnly: true,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
            ),
            controller: TextEditingController(text: summary),
          ),
          SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              setSummary("Résumé du contenu...");
            },
            child: Text("Générer le résumé"),
          ),
        ],
      ),
    );
  }
}
