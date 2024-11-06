import 'package:flutter/material.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

class RecordTab extends StatefulWidget {
  @override
  _RecordTabState createState() => _RecordTabState();
}

class _RecordTabState extends State<RecordTab> {
  FlutterSoundRecorder? _recorder;
  bool _isRecording = false;
  String? _filePath;

  @override
  void initState() {
    super.initState();
    _initializeRecorder();
  }

  Future<void> _initializeRecorder() async {
    _recorder = FlutterSoundRecorder();

    // Request permissions and initialize the recorder
    await _recorder?.openRecorder();
  }

  Future<void> _startRecording() async {
    Directory appDocDirectory = await getApplicationDocumentsDirectory();
    _filePath = '${appDocDirectory.path}/recording.aac';

    await _recorder?.startRecorder(
      toFile: _filePath,
      codec: Codec.aacADTS,
    );

    setState(() {
      _isRecording = true;
    });
  }

  Future<void> _stopRecording() async {
    await _recorder?.stopRecorder();

    setState(() {
      _isRecording = false;
    });

    if (_filePath != null) {
      print('Recording saved to $_filePath');
    }
  }

  @override
  void dispose() {
    _recorder?.closeRecorder();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ElevatedButton(
        onPressed: _isRecording ? _stopRecording : _startRecording,
        child: Text(_isRecording ? 'Arrêter l\'enregistrement' : 'Démarrer l\'enregistrement'),
        style: ElevatedButton.styleFrom(primary: _isRecording ? Colors.red : Colors.green),
      ),
    );
  }
}
