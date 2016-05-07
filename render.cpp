#include "mainwindow.h"

void MainWindow::paintEvent(QPaintEvent *)
{
	QPainter painter(this);
	painter.drawText(100, 100, QString::number(score));
	painter.setPen(Qt::gray);
	int lastPointY = 0;
	for (int i = 0; i<fftResult.length(); ++i)
	{
		painter.drawLine(i * 3, height() - 10 - lastPointY / 10, (i + 1) * 3, height() - 10 - fftResult[i] / 10);
		lastPointY = fftResult[i];
	}
}
