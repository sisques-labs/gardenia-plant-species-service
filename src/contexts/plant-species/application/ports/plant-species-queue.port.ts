export const PLANT_SPECIES_QUEUE_PORT = Symbol('PLANT_SPECIES_QUEUE_PORT');

/**
 * Outbound port for handing plant species names off to an asynchronous worker.
 *
 * The application layer depends only on this interface; the concrete transport
 * (a Redis list, in `infrastructure/adapters`) is an implementation detail.
 */
export interface IPlantSpeciesQueuePort {
  /**
   * Enqueues the given species names for downstream processing by the worker,
   * preserving their order. Implementations decide the wire format.
   */
  enqueue(names: string[]): Promise<void>;
}
