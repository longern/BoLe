#ifndef AUDIOIN_H
#define AUDIOIN_H

#include <QVector>
#include <QBuffer>
#include <QAudioInput>

class AudioIn : public QObject
{
	Q_OBJECT

public:
	AudioIn();
	const QVector<qint16> &getAudioData() { return audioData; }
	QAudioFormat format() { return audio->format(); }

signals:
	void audioWritten();

private slots:
	void onAudioWritten(qint64);

private:
	QAudioInput *audio;
	QBuffer audioBuffer;
	QVector<qint16> audioData;
};

#endif // AUDIOIN_H
