#include "fft.h"

#define PI 3.1415926535897932

void fftChange(std::vector<std::complex<double> > &y, int len)
{
	int i, j, k;
	for (i = 1, j = len / 2; i < len - 1; i++)
	{
		if (i < j)
			std::swap(y[i], y[j]);
		//交换互为小标反转的元素，i<j保证交换一次
		//i做正常的+1，j左反转类型的+1,始终保持i和j是反转的
		k = len / 2;
		while (j >= k)
		{
			j -= k;
			k /= 2;
		}
		if (j < k)
			j += k;
	}
}

/*
* 做FFT
* len必须为2^k形式，
* on==1时是DFT，on==-1时是IDFT
*/
void fft(std::vector<std::complex<double> > &y, int len, int on)
{
	fftChange(y, len);
	for (int h = 2; h <= len; h <<= 1)
	{
		std::complex<double> wn(cos(-on * 2 * PI / h), sin(-on * 2 * PI / h));
		for (int j = 0; j < len; j += h)
		{
			std::complex<double> w(1, 0);
			for (int k = j; k < j + h / 2; k++)
			{
				std::complex<double> u = y[k];
				std::complex<double> t = w * y[k + h / 2];
				y[k] = u + t;
				y[k + h / 2] = u - t;
				w = w * wn;
			}
		}
	}
	if (on == -1)
		for (int i = 0; i < len; i++)
			y[i].real(y[i].real() / len);
}
