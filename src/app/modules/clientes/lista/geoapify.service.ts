import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GeoapifyAutocompleteResponse, GeoapifyFeature, Direccion } from './cliente.model';

@Injectable({
	providedIn: 'root'
})
export class GeoapifyService {

	private readonly apiKey = environment.geoapifyApiKey;
	private readonly baseUrl = 'https://api.geoapify.com/v1/geocode';

	constructor(private http: HttpClient) { }

	/**
	 * Buscar direcciones con autocompletado usando Geoapify
	 * @param text Texto de búsqueda
	 * @param limit Número máximo de resultados (default: 5)
	 * @returns Observable con la respuesta de Geoapify
	 */
	autocomplete(text: string, limit: number = 5): Observable<GeoapifyAutocompleteResponse> {
		const url = `${this.baseUrl}/autocomplete`;
		const params = {
			text: text.trim(),
			apiKey: this.apiKey,
			limit: limit.toString(),
			format: 'geojson',
			lang: 'es'
		};

		return this.http.get<GeoapifyAutocompleteResponse>(url, { params });
	}

	/**
	 * Geocodificar una dirección específica
	 * @param address Dirección completa
	 * @returns Observable con los resultados de geocodificación
	 */
	geocode(address: string): Observable<GeoapifyAutocompleteResponse> {
		const url = `${this.baseUrl}/search`;
		const params = {
			text: address.trim(),
			apiKey: this.apiKey,
			limit: '1',
			format: 'geojson',
			lang: 'es'
		};

		return this.http.get<GeoapifyAutocompleteResponse>(url, { params });
	}

	/**
	 * Formatear una dirección desde la respuesta de Geoapify
	 * @param feature Feature de Geoapify
	 * @returns Objeto de dirección formateado para el cliente
	 */
	formatearDireccion(feature: GeoapifyFeature): Direccion {
		const props = feature.properties;

		// Extraer componentes de la dirección
		const street = props.address_line1?.split(' ')[0] || '';
		const number = props.address_line1?.split(' ')[1] || '';
		const neighborhood = props.suburb || props.district || '';
		const city = props.city || '';
		const state = props.state || '';
		const country = props.country || 'México';
		const postalCode = '';

		return {
			street,
			number,
			neighborhood,
			city,
			state,
			country,
			postalCode,
			formatted: {
				line1: props.address_line1 || props.formatted || '',
				line2: props.address_line2 || `${city}, ${state}`,
				line3: `${country} ${postalCode}`.trim()
			},
			geoapifyPlaceId: props.place_id || '',
			confidence: props.rank?.confidence || 0,
			source: 'Geoapify' as const
		};
	}
}
