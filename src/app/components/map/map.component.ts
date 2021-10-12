import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DataService} from '../../services/data.service';
import {MapInfoWindow} from '@angular/google-maps';
import {FormControl} from '@angular/forms';
import {CarTypes, Statuses} from "../../enums";
import {BehaviorSubject, Subject} from "rxjs";
import {catchError, takeUntil} from "rxjs/operators";
import {ErrorHandler} from "../../error-handler";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow | undefined;
  warsaw = {lat: 52.229676, lng: 21.012229};
  zoom = 10;
  center: google.maps.LatLngLiteral = this.warsaw;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
  };
  private routeDestroyed: Subject<Boolean> = new Subject();
  private loading = new BehaviorSubject<boolean>(true);
  public readonly loading$ = this.loading.asObservable();
  markers: any[] = [];
  infoContent: string = '';
  status = new FormControl();
  statusesList: string[] = [];
  markerClustererImagePath: string =
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';

  constructor(private dataService: DataService) {
    this.statusesList = [
      CarTypes.TRUCK,
      CarTypes.CAR,
      Statuses.AVAILABLE,
      Statuses.UNAVAILABLE,
    ];
  }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData(): void {
    this.dataService.getAllVehicles().pipe(takeUntil(this.routeDestroyed)).subscribe(
      {
        next: response => {
          response.objects.forEach((data: any) => {
            let icon: string;
            if (data.status === Statuses.AVAILABLE) {
              icon = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
            } else if (data.status === Statuses.UNAVAILABLE) {
              icon = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
            } else {
              icon = 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
            }
            this.markers.push({
              position: {
                lat: data.location.latitude,
                lng: data.location.longitude,
              },
              icon: icon,
              title: `Discriminator: ${data.discriminator}
                Type: ${data.type}
                Name: ${data.name}
                Color: ${data.color}
                Battery Level: ${data.batteryLevelPct}%
                Range Km: ${data.rangeKm}km
                Reservation: ${data.reservation}
                Reservation End: ${data.reservationEnd}
                Status: ${data.status}`,
              options: {
                animation: google.maps.Animation.DROP
              },
              visible: false,
              category: {
                status: data.status,
                type: data.type
              }
            });
          });
        },
        error: (err: HttpErrorResponse) => catchError(new ErrorHandler().errorHandler(err)),
        complete: () => this.loading.next(false)
      });
  }

  openInfo(marker: any, content: string) {
    this.infoWindow?.open(marker);
    this.infoContent = content;
  }

  filterMarkers(): void {
    for (let i = 0; i < this.markers.length; i++) {
      if (String(this.status.value) === Statuses.ALL) {
        this.markers[i].visible = true;
      } else {
        if (this.markers[i].category.type === CarTypes.TRUCK) {
          this.markers[i].visible = !!this.status.value.includes(CarTypes.TRUCK);
        } else if (this.markers[i].category.type === CarTypes.CAR) {
          this.markers[i].visible = !!this.status.value.includes(CarTypes.CAR);
        }

        if (this.status.value.includes(Statuses.AVAILABLE)) {
          this.markers[i].visible = !!this.status.value.includes(Statuses.AVAILABLE);
        } else if (this.markers[i].category.status === Statuses.UNAVAILABLE) {
          this.markers[i].visible = !!this.status.value.includes(Statuses.UNAVAILABLE);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.routeDestroyed.next(true);
    this.routeDestroyed.complete();
  }
}
