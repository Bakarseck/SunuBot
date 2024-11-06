import 'package:flutter/material.dart';

class TranscribeTab extends StatelessWidget {
  final String transcription;
  final VoidCallback handleTranscribe;

  TranscribeTab({required this.transcription, required this.handleTranscribe});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        children: [
          Text("Transcription", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          TextField(
            maxLines: 5,
            readOnly: true,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
            ),
            controller: TextEditingController(text: transcription),
          ),
          SizedBox(height: 16),
          ElevatedButton(
            onPressed: handleTranscribe,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.download),
                SizedBox(width: 8),
                Text("Télécharger"),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
