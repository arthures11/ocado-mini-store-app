const a=t=>t.main+t.fractional/100,r=t=>typeof t=="number"?t.toFixed(2):`${t.main}.${String(t.fractional).padStart(2,"0")}`;export{r as f,a as g};
