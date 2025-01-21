class SchedulesController < ApplicationController
  def index
    @technicians = Technician.order(:id)

    @start_hour = 6
    @end_hour = 16
    
    # All work orders
    @work_orders = WorkOrder.includes(:location, :technician).all
  end
end
