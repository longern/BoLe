#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QtWidgets>
#include "audioin.h"
#include "songinfo.h"

class MainWindow : public QWidget
{
	Q_OBJECT
public:
	explicit MainWindow(QWidget *parent = 0);

signals:

private slots:
	void onAudioWritten();

protected:
	void paintEvent(QPaintEvent *);

private:
	QWidget *formPlay;
	AudioIn *audio;
	SongInfo info;
	QTime gameBeginTime;
	QVector<qint16> fftResult;
	double score;
};

#endif // MAINWINDOW_H
