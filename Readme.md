# Task management

U web razvojnom okruženju izraditi informacijski sustav koji služi za upravljanje zadacima „PIN
zadaci“. Samostalno osmisliti vizualni identitet i funkcionalnosti.

## Minimalne funkcionalnosti:

Informacijski sustav se treba imati dio za prijavu korisnika
Svaki korisnik treba imati mogućnost dodijeljivanja zadatka drugom korisniku
Svaki zadatak se sastoji od atributa naslov, opis, krajnji rok izvršenja
Kod zadavanja zadatka odabiru se svi atributi i korisnik koji zadatak treba riješiti
Svaki korisnik može vidjeti listu zadataka koje je on zadao i listu zadatka koje je on
primio
Korisnik može obrisati samo zadatke koje je on kreirao
Zadatke koje korisnik primi može postaviti kao odrađene i napisati nekakvu napomenu
Na zadacima koje korisnik kreira može mijenjati opis i krajnji rok izvršenja
Svaki zadatak treba imati listu napomena da se može vidjeti tko je i kada napisao koji
komentar
U listi zadatak zadaci koji su odrađeni trebaju biti označeni zelenom bojom
Korisnik koji je kreirao zadatak može mijenjati korisnika koji zadatak treba odraditi. U
tom slučaju se kreira automatska napomena „Zadatak je promijenio korisnika iz ... u ....“
Korisnik koji je primio zadatak može proslijediti zadatak drugom korisniku. U tom slučaju
se kreira automatska napomena „Korisnik ... je proslijedio zadatak korisniku ...“


## NAPOMENE:
- Izvor podatka je Firebase
- Za vizualni identitet potrebno je koristiti Boostrap programski okvir
- Za odabir datuma koristiti Boostrap Datepicker, lokaliziran na hrvatski jezik
- U svim formama za postojeće vrijednosti omogućiti odabri preko padajućeg izbornika
koji identifikatore treba imati sakrivene u pozadini, npr. vrijednosti ime i prezime su
vidljive, OIB je sakriven.
- Svi tablični prikazi trebaju imati jQuery „live“ tražilicu po svim kolonama.
- Prilikom brisanja zapisa treba se prikazati poruka sa potvrdom „Da li ste sigurni....“