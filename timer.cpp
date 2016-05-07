#include "mainwindow.h"
#include "fft.h"

double pitchToFrequency(int pitch)
{
	return 440 * std::pow(2, (pitch + 3) / 12.);
}

int frequencyToPitch(double frequency)
{
	return round(std::log2(frequency / 440) * 12. - 3);
}

void MainWindow::onAudioWritten()
{
	const QVector<qint16> &audioData = audio->getAudioData();
	fftResult.clear();
	int len = audioData.length();

	int targetLength = int(pow(2, ceil(log2(double(len)))));  //  Expand the length to 2^n
	{
		std::vector<std::complex<double> > cAudioData;
		cAudioData.resize(targetLength);
		for (int i = 0; i < len; i++)
			cAudioData[i] = std::complex<double>(audioData[i], 0);
		fft(cAudioData, targetLength, 1);
		//  Fast Fourier Transform

		fftResult.resize(targetLength / 2);
		fftResult[0] = 0;
		for (size_t i = 1; i < cAudioData.size() / 2; i++)
			fftResult[i] = abs(cAudioData[i].real() * 2 / len);
		//  The latter part is the reflection of the first half part

		//  Destroy complex vector
	}

	if(gameBeginTime.isNull())
	{
		double requestFreq = pitchToFrequency(info.pitch.first());

		auto maxIter = std::max_element(fftResult.begin() + 3, fftResult.end());
		qDebug() << requestFreq << maxIter - fftResult.begin();
		int maxFrequency = (maxIter - fftResult.begin()) * audio->format().sampleRate() / targetLength;
		int requestIndex = requestFreq * targetLength / audio->format().sampleRate();
		setWindowTitle(QString::number(maxFrequency) + "Hz");
		if(maxIter - fftResult.begin() == requestIndex && *maxIter >= 10)
		{
			gameBeginTime.start();
			score += 1.;
		}
	}
	else
	{
		double beatPass = gameBeginTime.elapsed() / info.msPerBeat;

		auto maxIter = std::max_element(fftResult.begin() + 3, fftResult.end());
		int maxFrequency = (maxIter - fftResult.begin()) * audio->format().sampleRate() / targetLength;
		setWindowTitle(QString::number(maxFrequency) + "Hz");
		qDebug() << frequencyToPitch(maxFrequency);
		if(frequencyToPitch(maxFrequency) == info.pitch.at(int(score)))
		{
			score += 1.;
		}
	}

	update();
}
