#include "mainwindow.h"
#include "formplay.h"
#include "readnote.h"
#include "audioin.h"

MainWindow::MainWindow(QWidget *parent) : QWidget(parent)
{
	score = 0.;
	resize(800, 600);
	setWindowTitle(tr("Bole"));
	formPlay = new FormPlay(this);
	formPlay->setGeometry(0, 0, width(), height());

	NoteReader::readNotes(QStringLiteral("evening5.txt"), info);
	audio = new AudioIn;
	connect(audio, SIGNAL(audioWritten()), this, SLOT(onAudioWritten()));
}
