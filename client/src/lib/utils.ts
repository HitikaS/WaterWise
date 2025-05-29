import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWaterSaved(liters: number): string {
  if (liters >= 1000) {
    return `${(liters / 1000).toFixed(1)}k`;
  }
  return liters.toString();
}

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getRiskLevelColor(riskLevel: number): string {
  if (riskLevel >= 80) return 'text-red-500';
  if (riskLevel >= 60) return 'text-warning';
  if (riskLevel >= 40) return 'text-yellow-500';
  return 'text-green-500';
}

export function getWeatherIcon(icon: string): string {
  switch (icon) {
    case 'sun':
      return 'fas fa-sun';
    case 'cloud':
      return 'fas fa-cloud';
    case 'cloud-rain':
      return 'fas fa-cloud-rain';
    case 'snow':
      return 'fas fa-snowflake';
    default:
      return 'fas fa-sun';
  }
}
