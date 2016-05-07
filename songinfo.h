#ifndef SONGINFO_H
#define SONGINFO_H

#include <QVector>
#include <QPair>

class SongInfo
{
public:
	double msPerBeat;
	QVector<int> pitch;
	QVector<int> timeline;
	QVector<bool> hit;
};

#endif // SONGINFO_H
