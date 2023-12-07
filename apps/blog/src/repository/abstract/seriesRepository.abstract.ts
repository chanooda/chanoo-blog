import { IdReq, Series, SeriesDetail } from 'utils';
import { AbstractBaseRepository } from './baseRepository.abstract';

export abstract class AbstractSeriesRepository extends AbstractBaseRepository {
  abstract getSeries: () => Promise<Series[]>;

  abstract getSeriesDetail: (idReq: IdReq) => Promise<SeriesDetail>;
}
