#include "formplay.h"
#include "ui_formplay.h"

FormPlay::FormPlay(QWidget *parent) :
	QWidget(parent),
	ui(new Ui::FormPlay)
{
	ui->setupUi(this);
}

FormPlay::~FormPlay()
{
	delete ui;
}
