import { GlobalResponse, IdReq, Series, SeriesDetail } from 'utils';
import { AbstractSeriesRepository } from './abstract/seriesRepository.abstract';
import { BaseRepository } from './baseRepository';

export class SeriesRepository extends BaseRepository implements AbstractSeriesRepository {
  async getSeries() {
    try {
      const series = await this.client.get<GlobalResponse<Series[]>>('series');
      return series.data.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getSeriesDetail(idReq: IdReq) {
    const seriesDetail = await this.client.get<GlobalResponse<SeriesDetail>>(`/series/${idReq.id}`);
    return seriesDetail.data.data;
  }
}
