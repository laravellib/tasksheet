<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\SheetCell;

class SheetRow extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;

  protected $table = 'sheetRows';

  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'cells'];
  protected $fillable = ['id', 'sheetId'];
  protected $appends = ['cells'];
  
  public function getCellsAttribute() {
    $cells =  SheetCell::where('rowId', '=', $this->id)
    ->join('sheetColumns', 'sheetCells.columnId', '=', 'sheetColumns.id')
    ->orderBy('sheetColumns.createdAt', 'ASC')
    ->select('sheetCells.id', 'columnId', 'rowId', 'value')
    ->get();
    return $cells;
  }
}