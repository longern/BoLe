#-------------------------------------------------
#
# Project created by QtCreator 2016-01-16T12:14:27
#
#-------------------------------------------------

QT       += core gui multimedia

QT       -= network

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++11

TARGET = Bole
TEMPLATE = app


SOURCES += main.cpp \
    fft.cpp \
    audioin.cpp \
    readnote.cpp \
    mainwindow.cpp \
    timer.cpp \
    render.cpp \
    init.cpp \
    formplay.cpp

HEADERS  += \
    fft.h \
    audioin.h \
    readnote.h \
    songinfo.h \
    mainwindow.h \
    formplay.h

FORMS    += \
    formplay.ui

RESOURCES += \
    resource.qrc
