import 'package:flutter/material.dart';

class RecordTab extends StatelessWidget {
  final bool isRecording;
  final VoidCallback toggleRecording;

  RecordTab({required this.isRecording, required this.toggleRecording});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ElevatedButton(
        onPressed: toggleRecording,
        child: Text(isRecording ? 'Arrêter l\'enregistrement' : 'Démarrer l\'enregistrement'),
        style: ElevatedButton.styleFrom(primary: isRecording ? Colors.red : Colors.green),
      ),
    );
  }
}
