import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from 'src/app/services/marker.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-beranda',
  templateUrl: './beranda.component.html',
  styleUrls: ['./beranda.component.scss'],
})
export class BerandaComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: any;
  private subs = new SubSink();
  stateMap: boolean = false; // False -> Not Showing Google Map, True -> show google map

  constructor(private makerService: MarkerService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadPlots();
  }

  private initMap(): void {
    this.map = L.map('map').setView([-8.635864, 115.192055], 21);
  }

  private loadPlots(): void {
    const bounds =
      '115.19192682579163,-8.635945622432802,115.19218364730479,-8.635783199701216';
    this.subs.sink = this.makerService.getPlots(bounds).subscribe((data) => {
      data.features.forEach((feature: any) => {
        // Mapping Coordinates, get the lat and long
        const coordinates = feature.geometry.coordinates[0].map(
          (coord: [number, number]) => [coord[1], coord[0]]
        );
        // Creating a polygon where the coordinates get from mapping coordinates, and add color blue and weight 1 to the map
        const polygon = L.polygon(coordinates, {
          color: 'blue',
          weight: 1,
        }).addTo(this.map);
        // Mapping content of properties map from responses such as Plot and Person Details
        const content = this.mappingContent(feature);

        // Function for display content when hover
        this.displayContentWhenHover(polygon, content);
        // Function for binding content into popup when clicked
        polygon.bindPopup(content);
      });
    });
  }

  mappingContent(feature: any) {
    const content = `
          <div>
            <strong>Plot ID:</strong> ${feature.properties.plot_id}<br>
            <strong>Status:</strong> ${feature.properties.status}<br>
            <strong>Section:</strong> ${feature.properties.section}<br>
            <strong>Row:</strong> ${feature.properties.row}<br>
            <strong>Plot No:</strong> ${feature.properties.plot_no}<br>
            <strong>Cemetery:</strong> ${feature.properties.cemetery_name}<br>
            <strong>Persons:</strong>
            <ul>
              ${feature.properties.persons
                .map(
                  (person: any) => `
                <li>${person.first_name} ${person.last_name} (${person.date_of_birth} - ${person.date_of_death}, Age: ${person.age})</li>
              `
                )
                .join('')}
            </ul>
          </div>
        `;
    return content;
  }

  displayContentWhenHover(polygon: any, content: any) {
    //  When mouser over to the polygon show popup detail of content (we need getcenter() to make popup appear in the middle (otherwise it could be appear in invalid position))
    polygon.on('mouseover', () => {
      L.popup()
        .setLatLng(polygon.getBounds().getCenter())
        .setContent(content)
        .openOn(this.map);
    });

    //  When mouser out close popup detail of content
    polygon.on('mouseout', () => {
      this.map.closePopup();
    });
  }

  setLayerGoogleMap() {
    const layer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    if (this.stateMap) {
      this.map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          this.map.removeLayer(layer);
        }
      });

      this.map.setZoom(this.map.getZoom() + 3);
    } else {
      layer.addTo(this.map);
    }
    this.stateMap = !this.stateMap;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
