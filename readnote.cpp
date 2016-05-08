#include "readnote.h"
#include <QFile>
#include <QTextStream>

bool NoteReader::readNotes(const QString &filename, SongInfo &info)
{
	QFile songInfoFile(filename);
	if (songInfoFile.open(QIODevice::ReadOnly))
	{
		QTextStream ts(&songInfoFile);
		double bpm;
		ts >> bpm;
		info.msPerBeat = 6000 / bpm;

		info.pitch.clear();
		info.timeline.clear();
		while (true)
		{
			int pitch, time;
			ts >> pitch >> time;
			if (ts.atEnd())
				break;
			info.pitch.append(pitch);
			info.timeline.append(time);
		}
		info.hit.fill(false, info.pitch.size());
		return true;
	}
	else
	{
		return false;
	}
}

NoteReader::NoteReader()
{

}
