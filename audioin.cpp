#include "audioin.h"
#include <QDataStream>
#include <QDebug>

AudioIn::AudioIn()
{
	QAudioFormat format = QAudioDeviceInfo::availableDevices(QAudio::AudioInput).last().preferredFormat();
	format.setSampleSize(16);
	audio = new QAudioInput(QAudioDeviceInfo::availableDevices(QAudio::AudioInput).last(), format);
	audioBuffer.open(QIODevice::ReadWrite);
	connect(&audioBuffer, SIGNAL(bytesWritten(qint64)), this, SLOT(onAudioWritten(qint64)));
	audio->start(&audioBuffer);
}

void AudioIn::onAudioWritten(qint64 len)
{
	len /= audio->format().sampleSize() / 8;
	QDataStream audioDataStream(&audioBuffer);
	audioDataStream.setByteOrder(QDataStream::LittleEndian);

	audioBuffer.reset();
	audioData.resize(len);
	for (int i = 0; i < len; i++)
	{
		qint16 x;
		audioDataStream >> x;
		audioData[i] = x;
	}
	audioBuffer.reset();
	emit audioWritten();
}
