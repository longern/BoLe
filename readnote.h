#ifndef READNOTE_H
#define READNOTE_H

#include "songinfo.h"

class NoteReader
{
public:
	static bool readNotes(const QString &filename, SongInfo &info);

private:
	NoteReader();
};

#endif // READNOTE_H
