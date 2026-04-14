'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { IoMdClose } from 'react-icons/io';
import { HiMapPin } from 'react-icons/hi2';

interface AddressMapModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (address: string) => void;
  initialAddress?: string;
}

const ORENBURG_CENTER: [number, number] = [51.7687, 55.0968];
const ORENBURG_BOUNDS: [[number, number], [number, number]] = [
  [51.65, 54.85],
  [51.88, 55.25],
];

export default function AddressMapModal({
  open,
  onClose,
  onSelect,
  initialAddress,
}: AddressMapModalProps) {
  const [address, setAddress] = useState(initialAddress || '');
  const [position, setPosition] = useState<[number, number]>(ORENBURG_CENTER);
  const [mapReady, setMapReady] = useState(false);

  // Sync address when modal reopens with a different initialAddress
  useEffect(() => {
    if (open) {
      setAddress(initialAddress || '');
    }
  }, [open, initialAddress]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=ru`,
      );
      const data = await res.json();
      if (data.display_name) {
        const parts = data.display_name.split(', ');
        const filtered = parts.filter(
          (p: string) =>
            !p.includes('Оренбургская область') &&
            !p.includes('Приволжский') &&
            !p.includes('Россия') &&
            !p.includes('Russia'),
        );
        return filtered.join(', ');
      }
    } catch {
      // ignore
    }
    return '';
  }, []);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const initMap = async () => {
      const L = await import('leaflet');
      leafletRef.current = L;

      if (cancelled || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: ORENBURG_CENTER,
        zoom: 14,
        maxBounds: L.latLngBounds(ORENBURG_BOUNDS[0], ORENBURG_BOUNDS[1]),
        minZoom: 12,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const marker = L.marker(ORENBURG_CENTER, { icon, draggable: true }).addTo(map);
      markerRef.current = marker;
      mapRef.current = map;

      marker.on('dragend', async () => {
        const pos = marker.getLatLng();
        const bounds = L.latLngBounds(ORENBURG_BOUNDS[0], ORENBURG_BOUNDS[1]);
        if (!bounds.contains(pos)) {
          marker.setLatLng(ORENBURG_CENTER);
          setPosition(ORENBURG_CENTER);
          const addr = await reverseGeocode(ORENBURG_CENTER[0], ORENBURG_CENTER[1]);
          setAddress(addr);
          return;
        }
        setPosition([pos.lat, pos.lng]);
        const addr = await reverseGeocode(pos.lat, pos.lng);
        setAddress(addr);
      });

      map.on('click', async (e: any) => {
        const bounds = L.latLngBounds(ORENBURG_BOUNDS[0], ORENBURG_BOUNDS[1]);
        if (!bounds.contains(e.latlng)) return;
        marker.setLatLng(e.latlng);
        setPosition([e.latlng.lat, e.latlng.lng]);
        const addr = await reverseGeocode(e.latlng.lat, e.latlng.lng);
        setAddress(addr);
      });

      setMapReady(true);

      const addr = await reverseGeocode(ORENBURG_CENTER[0], ORENBURG_CENTER[1]);
      if (!cancelled) setAddress(addr);
    };

    const timer = setTimeout(initMap, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        setMapReady(false);
      }
    };
  }, [open, reverseGeocode]);

  useEffect(() => {
    if (open && mapRef.current) {
      const timer = setTimeout(() => mapRef.current?.invalidateSize(), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleConfirm = () => {
    if (address.trim()) {
      onSelect(address.trim());
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative w-full md:max-w-3xl md:mx-4 rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh]"
        style={{ backgroundColor: '#F3EBDB' }}>
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          <h3 className="text-lg md:text-xl font-semibold">Адрес доставки</h3>
          <button
            onClick={onClose}
            className="p-2 bg-black/10 rounded-full cursor-pointer hover:bg-black/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <IoMdClose size={20} />
          </button>
        </div>

        <div className="relative w-full h-[250px] md:h-[400px] lg:h-[500px]">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <div ref={mapContainerRef} className="w-full h-full" />
          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <p className="text-black/60">Загрузка карты...</p>
            </div>
          )}
        </div>

        <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col gap-2 md:gap-3">
          <div
            className="flex items-start gap-3 p-3 rounded-2xl"
            style={{ backgroundColor: '#EDE5D6' }}>
            <HiMapPin size={22} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-black/50 mb-0.5">Выбранный адрес</p>
              <p className="text-sm font-medium truncate">
                {address || 'Нажмите на карту для выбора адреса'}
              </p>
            </div>
          </div>

          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Или введите адрес вручную"
            className="w-full px-4 py-3 rounded-xl border border-black/10 outline-none text-base md:text-sm"
            style={{ backgroundColor: '#fff' }}
          />

          <button
            onClick={handleConfirm}
            disabled={!address.trim()}
            className="w-full py-3 text-white font-semibold rounded-full transition-colors hover:shadow-md disabled:opacity-50 min-h-[48px]"
            style={{ backgroundColor: '#D5715D' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c4604e')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D5715D')}>
            Подтвердить адрес
          </button>
        </div>
      </div>
    </div>
  );
}
