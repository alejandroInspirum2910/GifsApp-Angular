import { HttpClient, HttpParams } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Gifs, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  constructor( private http:HttpClient) { 
    if(localStorage.getItem('historial'))
    {
      this._historial=JSON.parse(localStorage.getItem('historial')!); 
    }

    // if(localStorage.getItem('resultados'))
    // {
    //   this.resultados=JSON.parse(localStorage.getItem('resultados')!); 
    // }

    this.resultados=JSON.parse(localStorage.getItem('resultados')!)||[];
  }
  

  private _historial:string[]=[];

  private api_key:string="ZwxMa1Fsp5mkrQONNNNt07GVExw52kS2";
  private host:string="https://api.giphy.com/v1";
  
  public resultados:Gifs[]=[];
  get historial()
  {
    //solo se admiten 10 elemento en el arreglo
    //this._historial=this._historial.slice(0,10);
    return [...this._historial];
  }

  buscarGifs(query:string)
  {
    //para capitalizar el texto
    //query=query.trim().replace(/^\w/, (c) => c.toUpperCase());
    query=query.trim().toLocaleLowerCase();
    //validamos que el valor nuevo para que no se duplique en el arreglo
      if(!this._historial.includes(query))
      {
        this._historial.unshift(query);
        this._historial=this._historial.slice(0,10);
        console.log(this._historial);

        localStorage.setItem('historial',JSON.stringify(this.historial) );
      }
      const params=new HttpParams()
      .set('api_key',this.api_key)
      .set('q',query)
      .set('limit', '10');
      
      this.http.get<SearchGifsResponse>(`${this.host}/gifs/search`,{params})
      //this.http.get<SearchGifsResponse>(this.host+'gifs/search?'+params)
      .subscribe((res)=> {
        //console.log(res.data);

        this.resultados=res.data;
        localStorage.setItem('resultados',JSON.stringify(this.resultados) );
      });
  }
}
