<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sheet extends Model
{
  use Traits\UsesUuid;

  /**
   * Define which attributes will be visible
   */
  protected $visible = ['id', 'sourceSheetId', 'fileType', 'rows', 'columns', 'filters', 'groups', 'sorts', 'visibleColumns'];
  protected $fillable = ['id', 'sourceSheetId', 'visibleColumns'];
  protected $with = ['filters', 'groups', 'sorts'];
  protected $appends = ['columns', 'rows', 'fileType'];
  protected $casts = [
    'visibleColumns' => 'array'
  ];
  
  public function getFileTypeAttribute() {
    return "SHEET";
  }
  
  /**
   * Get all the columns that belong to this table
   */
  public function getColumnsAttribute() {
    $sheetId = is_null($this->sourceSheetId) ? $this->id : $this->sourceSheetId;
    return SheetColumn::where('sheetId', '=', $sheetId)
    ->orderBy('created_at', 'ASC')
    ->get();
  }
  
  /**
   * Get all the filters that belong to this table
   */
  public function filters() {
    return $this->hasMany('App\Models\SheetFilter', 'sheetId');
  }
  
  /**
   * Get all the groups that belong to this table
   */
  public function groups() {
    return $this->hasMany('App\Models\SheetGroup', 'sheetId');
  }
  
  /**
   * Get all the rows that belong to this table
   */
  public function getRowsAttribute() {
    $sheetId = is_null($this->sourceSheetId) ? $this->id : $this->sourceSheetId;
    return SheetRow::where('sheetId', '=', $sheetId)
    ->get();
  }
  
  /**
   * Get all the sorts that belong to this table
   */
  public function sorts() {
    return $this->hasMany('App\Models\SheetSort', 'sheetId');
  }
  
  /**
   * Get all the views this sheet belongs to
   */
  public function views() {
    return $this->belongsToMany('App\Models\SheetView', 'sheetViewSheets', 'sheetId', 'sheetViewId');
  }
}