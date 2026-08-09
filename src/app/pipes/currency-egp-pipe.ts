import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyEgp',
  standalone: true
})
export class CurrencyEgpPipe implements PipeTransform {

  transform(value: number | null | undefined, includeSymbol: boolean = true): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0 EGP';
    }

    // تنسيق الرقم بفاصلة الألوف ورقمين عشريين
    const formattedValue = value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    return includeSymbol ? `${formattedValue} EGP` : formattedValue;
  }

}