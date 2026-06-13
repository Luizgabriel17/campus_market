import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totalCart',
  standalone: true
})
export class TotalCartPipe implements PipeTransform {
  transform(items: any[] | null): number {
    if (!items) return 0;
    return items.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
  }
}