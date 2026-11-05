import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class AllocationForecastService {
  constructor(
    private readonly supabaseService: SupabaseService,
  ) {}

  async forecastNextWeek(
    week_start_date: string,
  ) {
    const supabase =
      this.supabaseService.getClient();

    // Employees
    const {
      data: employees,
      error: empError,
    } = await supabase
      .from('employees')
      .select('*');

    if (empError) {
      throw new Error(
        empError.message,
      );
    }

    // Historical allocations
    const {
      data: allocations,
      error: allocError,
    } = await supabase
      .from('allocations')
      .select('*')
      .lte(
        'week_start_date',
        week_start_date,
      );

    if (allocError) {
      throw new Error(
        allocError.message,
      );
    }

    // ML predictions
    const {
      data: predictions,
      error: predictionError,
    } = await supabase
      .from('ml_predictions')
      .select('*');

    if (predictionError) {
      throw new Error(
        predictionError.message,
      );
    }

    const historyMap:
      Record<string, number[]> =
      {};

    allocations?.forEach(
      (a: any) => {
        if (
          !historyMap[
            a.employee_id
          ]
        ) {
          historyMap[
            a.employee_id
          ] = [];
        }

        historyMap[
          a.employee_id
        ].push(
          a.allocated_hours,
        );
      },
    );

    const predictionMap:
      Record<string, any> =
      {};

    predictions?.forEach(
      (p: any) => {
        predictionMap[
          p.employee_id
        ] = p;
      },
    );

    const forecast =
      employees.map(
        (emp: any) => {
          const history =
            historyMap[
              emp.id
            ] || [];

          const avg =
            history.length > 0
              ? history.reduce(
                  (
                    s: number,
                    v: number,
                  ) => s + v,
                  0,
                ) /
                history.length
              : 0;

          const last =
            history.length
              ? history[
                  history.length -
                    1
                ]
              : 0;

          const prev =
            history.length > 1
              ? history[
                  history.length -
                    2
                ]
              : last;

          const trend =
            last - prev;

          const predicted_hours =
            Math.max(
              0,
              avg + trend,
            );

          const capacity =
            emp.weekly_capacity_hours ||
            0;

          const utilization_next_week =
            capacity
              ? predicted_hours /
                capacity
              : 0;

          const ml =
            predictionMap[
              emp.id
            ] || {};

          const burnout_probability =
            Number(
              ml.burnout_probability ??
                0,
            );

          const delivery_confidence =
            Number(
              ml.delivery_confidence ??
                0,
            );

          const predicted_performance =
            Number(
              ml.predicted_performance ??
                0,
            );

          let overload_risk =
            'LOW';

          if (
            utilization_next_week >
              1 ||
            burnout_probability >
              0.8
          ) {
            overload_risk =
              'CRITICAL';
          } else if (
            utilization_next_week >
              0.85 ||
            burnout_probability >
              0.6
          ) {
            overload_risk =
              'HIGH';
          } else if (
            utilization_next_week >
              0.6 ||
            burnout_probability >
              0.4
          ) {
            overload_risk =
              'MEDIUM';
          }

          return {
            employee_id:
              emp.id,

            employee_name:
              emp.name,

            predicted_hours_next_week:
              Math.round(
                predicted_hours,
              ),

            capacity,

            utilization_next_week:
              Number(
                utilization_next_week.toFixed(
                  2,
                ),
              ),

            overload_risk,

            burnout_probability,

            delivery_confidence,

            predicted_performance,
          };
        },
      );

    const total_predicted =
      forecast.reduce(
        (
          s,
          e,
        ) =>
          s +
          e.predicted_hours_next_week,
        0,
      );

    const total_capacity =
      employees.reduce(
        (
          s: number,
          e: any,
        ) =>
          s +
          (e.weekly_capacity_hours ||
            0),
        0,
      );

    const capacity_gap =
      total_capacity -
      total_predicted;

    const staffing_signal =
      capacity_gap < 0
        ? 'SHORTAGE'
        : capacity_gap <
          total_capacity *
            0.15
        ? 'TIGHT'
        : 'HEALTHY';

    const avgBurnout =
      forecast.reduce(
        (
          s,
          e,
        ) =>
          s +
          e.burnout_probability,
        0,
      ) /
      (forecast.length ||
        1);

    const avgConfidence =
      forecast.reduce(
        (
          s,
          e,
        ) =>
          s +
          e.delivery_confidence,
        0,
      ) /
      (forecast.length ||
        1);

    let team_risk =
      'LOW';

    if (
      avgBurnout > 0.7
    ) {
      team_risk = 'HIGH';
    } else if (
      avgBurnout > 0.5
    ) {
      team_risk =
        'MEDIUM';
    }

    const hiring_recommendation =
      staffing_signal ===
      'SHORTAGE'
        ? 'Hire immediately'
        : staffing_signal ===
          'TIGHT'
        ? 'Monitor hiring needs'
        : 'Current staffing sufficient';

    return {
      week_start_date,

      team_summary: {
        total_predicted_hours:
          total_predicted,

        total_capacity,

        capacity_gap,

        staffing_signal,

        average_burnout_probability:
          Number(
            avgBurnout.toFixed(
              2,
            ),
          ),

        average_delivery_confidence:
          Number(
            avgConfidence.toFixed(
              2,
            ),
          ),

        team_risk,

        hiring_recommendation,
      },

      employee_forecast:
        forecast.sort(
          (
            a,
            b,
          ) =>
            b.utilization_next_week -
            a.utilization_next_week,
        ),
    };
  }
}